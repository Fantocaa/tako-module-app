<?php

namespace App\Http\Controllers;

use App\Models\PsychotestLink;
use App\Models\PsychotestQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;

use Barryvdh\DomPDF\Facade\Pdf;

class PsychotestController extends Controller
{
    /**
     * Display a listing of the psychotest links for testing purposes.
     */
    public function index()
    {
        return Inertia::render('psychotest/index', [
            'links' => PsychotestLink::latest()->get()->map(function($link) {
                return array_merge($link->toArray(), [
                    'duration' => $link->duration,
                    'is_expired' => $link->isExpired()
                ]);
            })
        ]);
    }
    
    public function storeApi(Request $request)
    {
        $client = auth()->user(); // system client

        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email',
            'nik' => 'nullable|string|max:16',
            'tests' => 'nullable|array',
            'tests.*' => 'string|in:cfit,disc,papicostic,skill_test', 
        ]);

        $link = PsychotestLink::create([
            'uuid' => Str::uuid(),
            'applicant_name' => $data['name'],
            'applicant_email' => $data['email'],
            'nik' => $data['nik'] ?? null,
            'expires_at' => now()->addHours(24),
            'included_tests' => $data['tests'] ?? null, // Store selected tests or null for all
        ]);

        return response()->json([
            'name' => $link->applicant_name,
            'email' => $link->applicant_email,
            'nik' => $link->nik,
            // 'psychotest_url' => route('psychotest.take-test', $link->uuid),
            'result_psikologi' => route('psychotest.take-test', $link->uuid),
            'expires_at' => $link->expires_at,
        ]);
    }

    /**
     * Store a newly created psychotest link (Simulating internal/external API request).
     */
    public function store(Request $request)
    {
        $request->validate([
            'applicant_name' => 'required|string|max:255',
            'applicant_email' => 'nullable|email',
            'included_tests' => 'nullable|array',
            'included_tests.*' => 'string|in:cfit,disc,papicostic,skill_test',
        ]);

        $link = PsychotestLink::create([
            'uuid' => (string) Str::uuid(),
            'applicant_name' => $request->applicant_name,
            'applicant_email' => $request->applicant_email,
            'included_tests' => $request->included_tests,
            'expires_at' => Carbon::now()->addHours(24), // Ends in 24 hours
        ]);

        return redirect()->back()->with('success', 'Temporary link generated successfully!');
    }

    /**
     * The actual psychotest page for the applicant.
     */
    public function testPage(Request $request, $uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        if ($link->isExpired()) {
            return Inertia::render('psychotest/error', [
                'message' => 'This link has expired.'
            ]);
        }
        
        // Session mapping
        $testTypeToSession = [
            'papicostic' => 1,
            'cfit' => 2,
            'disc' => 3,
            'skill_test' => 4 // Assuming skill test is 4 if needed
        ];
        
        // Filter allowed sessions based on included_tests
        $allowedSessions = [1, 2, 3]; // Default all
        if (!empty($link->included_tests)) {
            $allowedSessions = collect($link->included_tests)
                ->map(fn($type) => $testTypeToSession[$type] ?? null)
                ->filter()
                ->values()
                ->toArray();
        }

        // Session Hub
        if (!$request->has('session')) {
            return Inertia::render('psychotest/hub', [
                'link' => array_merge($link->toArray(), [
                    'allowed_sessions' => $allowedSessions // Pass allowed sessions to frontend
                ]),
                'currentSession' => $link->last_completed_session
            ]);
        }

        // Specific Session
        $session = (int) $request->session;
        
        // Check if session is in allowed list
        if (!in_array($session, $allowedSessions)) {
             return redirect()->route('psychotest.take-test', $uuid)
                ->with('error', 'This test section is not assigned to you.');
        }

        // Check if session is unlocked
        // Modified logic: We need to find the "next" allowed session, not just simple +1
        // But for now keeping simple strictly sequential logic might be complex if we skip 2.
        // Let's keep strict logic: You must complete session X before Y if X < Y and X is allowed.
        // Or actually, simple logic: is previous *allowed* session completed?
        
        // For simplicity let's rely on last_completed_session. 
        // If we skip session 2 (CFIT), then session 3 (DISC) becomes the "next" after session 1.
        // This requires dynamically calculating "next available session".
        // Use a simple check: is $session > ($link->last_completed_session + 1)? 
        // If we skip sessions, this logic breaks.
        // FIXED LOGIC: Users should follow the order of $allowedSessions.
        // But the legacy logic uses 'last_completed_session' (int).
        // Let's assume if you skip session 2, 'last_completed_session' will jump from 1 to 3? Or stay 1?
        // If we use 'last_completed_session' to track progress, we must ensure we update it correctly in submit().
        
        // ALLOWING simple access for now:
        if ($session > $link->last_completed_session + 1) {
             // Exception: if intermediate sessions are NOT allowed, we can skip them.
             // e.g. allowed=[1,3]. last_completed=1. Request session=3.
             // 3 > 1+1 (2). But 2 is not allowed. So 3 IS the next one.
             
             $previousAllowed = collect($allowedSessions)->filter(fn($s) => $s < $session)->max();
             if ($previousAllowed && $link->last_completed_session < $previousAllowed) {
                  return redirect()->route('psychotest.take-test', $uuid)
                    ->with('error', 'Please complete previous sessions first.');
             }
        }

        // Check if session is already done
        if ($session <= $link->last_completed_session) {
             return redirect()->route('psychotest.take-test', $uuid)
                ->with('error', 'Session already completed.');
        }

        // Set started_at if it's the first time strictly (global start)
        if (!$link->started_at) {
            $link->update([
                'started_at' => Carbon::now()
            ]);
        }
        
        // Fetch questions for this session
        $questions = PsychotestQuestion::where('session_number', $session)
            ->orderBy('section_number')
            ->orderBy('question_number')
            ->get();
            
        // Map questions to the format expected by frontend (if needed, or adjust frontend)
        // Adjusting frontend to match DB structure is better.
        
        // For time limit, we might want per-session limits. 
        // For now using global or hardcoded per session.
        $timeLimits = [
            1 => 60 * 60, // 60 mins for Papi
            2 => 30 * 60, // 30 mins for CFIT
            3 => 20 * 60, // 20 mins for DISC
        ];
        
        $sessionTimeLimit = $timeLimits[$session] ?? 600;

        // Server-side Timer Persistence
        $results = $link->results ?? [];
        if (!isset($results["session_{$session}"])) {
            $results["session_{$session}"] = [
                'started_at' => now()->toDateTimeString(),
                'current_section' => 1,
                'answers' => []
            ];
            $link->update(['results' => $results]);
        }

        $sessionData = $results["session_{$session}"];
        $startedAt = Carbon::parse($sessionData['started_at']);
        $elapsedSeconds = $startedAt->diffInSeconds(now());
        $remainingTime = max(0, $sessionTimeLimit - $elapsedSeconds);

        return Inertia::render('psychotest/take-test', [
            'link' => array_merge($link->toArray(), [
                'allowed_sessions' => $allowedSessions
            ]),
            'session' => $session,
            'questions' => $questions,
            'timeLimit' => $sessionTimeLimit,
            'remainingTime' => (int) $remainingTime,
            'currentSection' => $sessionData['current_section'] ?? 1,
            'savedAnswers' => $sessionData['answers'] ?? []
        ]);
    }

    /**
     * Handle the submission of the psychotest.
     */
    public function submit(Request $request, $uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        if ($link->isExpired()) {
             return redirect()->route('psychotest.error', ['message' => 'Invalid or expired link.']);
        }

        $request->validate([
            'answers' => 'required|array',
            'session' => 'required|integer'
        ]);
        
        $session = $request->session;
        $currentResults = $link->results ?? [];
        
        // Check if we are advancing to next section or completing session
        $isFinal = $request->input('is_final', false);
        $currentSection = $request->input('current_section', 1);

        // Initialize session data if missing
        if (!isset($currentResults["session_{$session}"])) {
             $currentResults["session_{$session}"] = [
                'started_at' => now()->toDateTimeString(),
                'answers' => []
             ];
        }

        // Update answers and progress
        $currentResults["session_{$session}"]['answers'] = array_merge(
            $currentResults["session_{$session}"]['answers'] ?? [],
            $request->answers
        );
        
        if (!$isFinal) {
            $currentResults["session_{$session}"]['current_section'] = $currentSection + 1;
        } else {
            $currentResults["session_{$session}"]['completed_at'] = now()->toDateTimeString();
        }

        $updateData = [
            'results' => $currentResults,
        ];
        
        // Calculate allowed sessions to determine max session
        $testTypeToSession = [
            'papicostic' => 1,
            'cfit' => 2,
            'disc' => 3,
            'skill_test' => 4
        ];
        
        $allowedSessions = [1, 2, 3, 4];
        if (!empty($link->included_tests)) {
            $allowedSessions = collect($link->included_tests)
                ->map(fn($type) => $testTypeToSession[$type] ?? null)
                ->filter()
                ->values()
                ->toArray();
        }

        // Update progress if this session is completed and further than before
        if ($isFinal && $session > $link->last_completed_session) {
            $updateData['last_completed_session'] = $session;
        }
        
        // Check if this was the last allowed session
        $maxSession = !empty($allowedSessions) ? max($allowedSessions) : 4;
        
        if ($isFinal && $session >= $maxSession) {
            $updateData['finished_at'] = now();
            $updateData['used_at'] = now();
        }

        $link->update($updateData);

        // If final, go back to Hub, else stay for next subtest
        if ($isFinal) {
            return redirect()->route('psychotest.take-test', $uuid);
        }

        return back();
    }

    /**
     * Show the psychotest report.
     */
    public function report($uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        return Inertia::render('psychotest/Report', [
            'link' => array_merge($link->toArray(), [
                'duration' => $link->duration
            ])
        ]);
    }

    /**
     * Download the psychotest report as PDF.
     */
    public function downloadPdf($uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        $pdf = Pdf::loadView('pdf.psychotest-report', [
            'link' => $link,
            'duration' => $link->duration
        ]);

        return $pdf->download("psychotest-report-{$link->applicant_name}.pdf");
    }

    /**
     * Restart the psychotest session for an applicant.
     */
    public function restart($uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        $link->update([
            'started_at' => null,
            'finished_at' => null,
            'used_at' => null,
            'results' => null,
            'expires_at' => Carbon::now()->addHours(24),
        ]);

        return redirect()->back()->with('success', 'Psychotest session restarted successfully!');
    }

    /**
     * Helper for error page if needed via route.
     */
    public function error(Request $request)
    {
        return Inertia::render('psychotest/error', [
            'message' => $request->get('message', 'An error occurred.')
        ]);
    }
}
