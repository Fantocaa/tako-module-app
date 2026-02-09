<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Test;
use App\Models\TestOption;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PapiController extends Controller
{
    public function index()
    {
        $questions = Test::with('options')
            ->where('type', 'forced')
            ->orderBy('order')
            ->get();

        return Inertia::render('psychotest/papi/index', [
            'questions' => $questions
        ]);
    }

    public function create()
    {
        return Inertia::render('psychotest/papi/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'option_a' => 'required',
            'dimension_a' => 'required',
            'option_b' => 'required',
            'dimension_b' => 'required',
        ]);

        DB::transaction(function () use ($request) {

            // Ambil section PAPI
            $section = Section::where('section_name', 'papi')->first();

            // Buat record di tabel tests (engine utama)
            $test = Test::create([
                'section_id' => $section->id,
                'question_text' => null,
                'type' => 'forced',
                'order' => Test::max('order') + 1,
            ]);

            // Statement A
            TestOption::create([
                'test_id' => $test->id,
                'content' => $request->option_a,
                'dimension_code' => $request->dimension_a,
                'is_correct' => false,
                'score' => 1,
            ]);

            // Statement B
            TestOption::create([
                'test_id' => $test->id,
                'content' => $request->option_b,
                'dimension_code' => $request->dimension_b,
                'is_correct' => false,
                'score' => 1,
            ]);
        });

        return redirect()->route('papi.index');
    }

    public function edit(Test $papi)
    {
        $papi->load('options');

        return Inertia::render('psychotest/papi/edit', [
            'question' => $papi
        ]);
    }

    public function update(Request $request, Test $papi)
    {
        $request->validate([
            'option_a' => 'required',
            'dimension_a' => 'required',
            'option_b' => 'required',
            'dimension_b' => 'required',
        ]);

        $options = $papi->options->values();

        $options[0]->update([
            'content' => $request->option_a,
            'dimension_code' => $request->dimension_a,
        ]);

        $options[1]->update([
            'content' => $request->option_b,
            'dimension_code' => $request->dimension_b,
        ]);

        return redirect()->route('papi.index');
    }

    public function destroy(Test $papi)
    {
        $papi->options()->delete();
        $papi->delete();

        return back();
    }
}
