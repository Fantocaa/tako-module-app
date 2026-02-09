<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\Test;
use App\Models\TestAnswer;
use App\Models\TestOption;
use App\Models\TestResult;
use App\Models\TestSubtest;
use App\Models\PsychotestLink;
use App\Http\Requests\SubmitTestRequest;
use App\Http\Services\PapiScoringService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestController extends Controller
{
    /*
    =========================================
    LOAD TEST BY TOKEN
    =========================================
    */

    public function start($token)
    {
        $link = PsychotestLink::where('token', $token)
            ->whereNull('completed_at')
            ->firstOrFail();

        $section = Section::findOrFail($link->section_id);

        return view("tests.{$section->section_name}.landing", compact('link', 'section'));
    }

    /*
    =========================================
    LOAD QUESTIONS
    =========================================
    */

    public function load($token)
    {
        $link = PsychotestLink::where('token', $token)
            ->whereNull('completed_at')
            ->firstOrFail();

        $section = Section::findOrFail($link->section_id);

        if ($section->section_name === 'cfit') {
            $subtests = TestSubtest::where('section_id', $section->id)
                ->orderBy('order')
                ->get();

            return view("tests.cfit.index", compact('link', 'subtests'));
        }

        $questions = Test::with('options')
            ->where('section_id', $section->id)
            ->orderBy('order')
            ->get();

        return view("tests.{$section->section_name}.index", compact('link', 'questions'));
    }

/*
=========================================
SUBMIT ANSWERS
=========================================
*/

public function submit(SubmitTestRequest $request, $token)

    {
        $link = PsychotestLink::where('token', $token)
            ->whereNull('completed_at')
            ->firstOrFail();

        DB::transaction(function () use ($request, $link) {

            foreach ($request->answers as $questionId => $value) {

                $question = Test::find($questionId);

                /*
                ===============================
                DISC
                ===============================
                */
                if ($question->type === 'disc') {

                    // value = ['most' => option_id, 'least' => option_id]

                    TestAnswer::create([
                        'psychotest_link_id' => $link->id,
                        'test_id' => $questionId,
                        'test_option_id' => $value['most'],
                        'disc_choice_type' => 'most'
                    ]);

                    TestAnswer::create([
                        'psychotest_link_id' => $link->id,
                        'test_id' => $questionId,
                        'test_option_id' => $value['least'],
                        'disc_choice_type' => 'least'
                    ]);
                }

                /*
                ===============================
                PAPI (FORCED)
                ===============================
                */
                elseif ($question->type === 'forced') {

                    TestAnswer::create([
                        'psychotest_link_id' => $link->id,
                        'test_id' => $questionId,
                        'test_option_id' => $value
                    ]);
                }

                /*
                ===============================
                MULTIPLE SELECT (CFIT 2)
                ===============================
                */
                elseif ($question->type === 'multiple_select') {

                    foreach ($value as $optionId) {
                        TestAnswer::create([
                            'psychotest_link_id' => $link->id,
                            'test_id' => $questionId,
                            'test_option_id' => $optionId
                        ]);
                    }
                }

                /*
                ===============================
                STANDARD / COMPARISON
                ===============================
                */
                else {
                    TestAnswer::create([
                        'psychotest_link_id' => $link->id,
                        'test_id' => $questionId,
                        'test_option_id' => $value
                    ]);
                }
            }

            $this->calculateScore($link);

            $link->update([
                'completed_at' => now()
            ]);
        });

        return redirect()->route('psychotest.finished');
    }

    /*
    =========================================
    SCORING ENGINE
    =========================================
    */

    private function calculateScore($link)
    {
        $answers = TestAnswer::with('option', 'test')
            ->where('psychotest_link_id', $link->id)
            ->get();

        $scoreData = [];

        foreach ($answers as $answer) {

            $question = $answer->test;
            $option = $answer->option;

            /*
            ==========================
            DISC SCORING
            ==========================
            */
            if ($question->type === 'disc') {

                if (!isset($scoreData[$option->dimension_code])) {
                    $scoreData[$option->dimension_code] = 0;
                }

                if ($answer->disc_choice_type === 'most') {
                    $scoreData[$option->dimension_code] += 1;
                }

                if ($answer->disc_choice_type === 'least') {
                    $scoreData[$option->dimension_code] -= 1;
                }
            }

            /*
            ==========================
            PAPI SCORING
            ==========================
            */
            elseif ($question->type === 'forced') {

                if (!isset($scoreData[$option->dimension_code])) {
                    $scoreData[$option->dimension_code] = 0;
                }

                $scoreData[$option->dimension_code] += 1;
            }

            /*
            ==========================
            CFIT SCORING
            ==========================
            */
            else {

                if ($option->is_correct) {
                    if (!isset($scoreData['total'])) {
                        $scoreData['total'] = 0;
                    }

                    $scoreData['total'] += 1;
                }
            }
}

if ($link->test->slug === 'papi') {

    $papiScoring = new PapiScoringService();
    $papiScoring->calculate($link->id);
}
        TestResult::create([
            'psychotest_link_id' => $link->id,
            'score_data' => $scoreData
        ]);
    }
}
