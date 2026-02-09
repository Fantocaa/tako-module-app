<?php

namespace App\Http\Services;

use App\Models\TestAnswer;
use App\Models\PapiScore;

class PapiScoringService
{
    public function calculate($linkId)
    {
        $answers = TestAnswer::with('option')
            ->where('psychotest_link_id', $linkId)
            ->get();

        $scores = [];

        foreach ($answers as $answer) {

            $dimension = $answer->option->dimension_code;

            if (!$dimension) continue;

            if (!isset($scores[$dimension])) {
                $scores[$dimension] = 0;
            }

            $scores[$dimension] += $answer->option->score_value;
        }

        // Save to DB
        foreach ($scores as $dimension => $total) {
            PapiScore::updateOrCreate(
                [
                    'psychotest_link_id' => $linkId,
                    'dimension_code' => $dimension
                ],
                [
                    'total_score' => $total
                ]
            );
        }

        return $scores;
    }
}
