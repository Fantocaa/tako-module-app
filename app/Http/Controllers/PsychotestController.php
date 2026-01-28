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
    public function testPage($uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        if ($link->isExpired()) {
            return Inertia::render('psychotest/error', [
                'message' => 'This link has expired.'
            ]);
        }

        if ($link->isUsed()) {
            return Inertia::render('psychotest/error', [
                'message' => 'This test has already been completed.'
            ]);
        }

        // Set started_at if it's the first time they open it
        if (!$link->started_at) {
            $link->update([
                'started_at' => Carbon::now()
            ]);
        }

        $timeLimitSeconds = PsychotestLink::SESSION_DURATION_SECONDS;
        $elapsedSeconds = $link->started_at->diffInSeconds(Carbon::now());
        $remainingTime = max(0, $timeLimitSeconds - $elapsedSeconds);

        if ($remainingTime <= 0) {

            // kunci sesi hanya sekali
            if (!$link->finished_at) {
                $link->update([
                    'finished_at' => now(),
                    'used_at' => now(),
                ]);
            }

            return Inertia::render('psychotest/error', [
                'message' => 'Your session time has expired.'
            ]);
        }

        return Inertia::render('psychotest/take-test', [
            'link' => $link,
            'timeLimit' => $timeLimitSeconds,
            'remainingTime' => $remainingTime
        ]);
    }

    /**
     * Handle the submission of the psychotest.
     */
    public function submit(Request $request, $uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        if ($link->isExpired() || $link->isUsed()) {
            return redirect()->route('psychotest.error', ['message' => 'Invalid or expired link.']);
        }

        $request->validate([
            'answers' => 'required|array',
        ]);

        $link->update([
            'used_at' => Carbon::now(),
            'finished_at' => Carbon::now(),
            'results' => $request->answers,
        ]);

        return Inertia::render('psychotest/success');
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
