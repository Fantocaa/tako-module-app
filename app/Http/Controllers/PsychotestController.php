<?php

namespace App\Http\Controllers;

use App\Models\PsychotestLink;
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
        ]);

        $link = PsychotestLink::create([
            'uuid' => Str::uuid(),
            'applicant_name' => $data['name'],
            'applicant_email' => $data['email'],
            'expires_at' => now()->addHours(24),
        ]);

        return response()->json([
            'psychotest_url' => route('psychotest.take-test', $link->uuid),
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
        ]);

        $link = PsychotestLink::create([
            'uuid' => (string) Str::uuid(),
            'applicant_name' => $request->applicant_name,
            'applicant_email' => $request->applicant_email,
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
        
        // Session Hub
        if (!$request->has('session')) {
            return Inertia::render('psychotest/hub', [
                'link' => $link,
                'currentSession' => $link->last_completed_session
            ]);
        }

        // Specific Session
        $session = (int) $request->session;
        
        // Check if session is unlocked
        if ($session > $link->last_completed_session + 1) {
            return redirect()->route('psychotest.take-test', $uuid)
                ->with('error', 'Please complete previous sessions first.');
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
        $questions = \App\Models\PsychotestQuestion::where('session_number', $session)
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

        return Inertia::render('psychotest/take-test', [
            'link' => $link,
            'session' => $session,
            'questions' => $questions,
            'timeLimit' => $sessionTimeLimit,
            'remainingTime' => $sessionTimeLimit // Simplified for now, ideally track per-session start time
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
        
        // Append new results
        $currentResults["session_{$session}"] = [
            'answers' => $request->answers,
            'completed_at' => now()->toDateTimeString()
        ];

        $updateData = [
            'results' => $currentResults,
        ];
        
        // Only increment if we are submitting the current expected session
        if ($session == $link->last_completed_session + 1) {
            $updateData['last_completed_session'] = $session;
        }
        
        // If all sessions done (assuming 3)
        if ($session >= 3) {
            $updateData['finished_at'] = now();
            $updateData['used_at'] = now();
        }

        $link->update($updateData);

        // Redirect back to Hub
        return redirect()->route('psychotest.take-test', $uuid);
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
