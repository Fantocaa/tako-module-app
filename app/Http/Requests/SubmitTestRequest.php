<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Test;
use App\Models\TestOption;

class SubmitTestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'answers' => ['required', 'array'],
            'answers.*' => ['required'], // detail akan dicek manual di withValidator()
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            $answers = $this->input('answers', []);

            foreach ($answers as $questionId => $value) {

                $question = Test::with('options')->find($questionId);

                if (!$question) {
                    $validator->errors()->add("answers.$questionId", 'Question tidak ditemukan.');
                    continue;
                }

                /*
                =====================================
                DISC (Most & Least)
                =====================================
                */
                if ($question->type === Test::TYPE_DISC) {

                    if (!is_array($value) || !isset($value['most']) || !isset($value['least'])) {
                        $validator->errors()->add("answers.$questionId", 'DISC wajib memilih Most dan Least.');
                        continue;
                    }

                    if ($value['most'] == $value['least']) {
                        $validator->errors()->add("answers.$questionId", 'Most dan Least tidak boleh sama.');
                    }

                    $this->validateOptionOwnership($question, $value['most'], $validator, $questionId);
                    $this->validateOptionOwnership($question, $value['least'], $validator, $questionId);
                }

                /*
                =====================================
                PAPI (Forced Choice)
                =====================================
                */
                elseif ($question->type === Test::TYPE_FORCED) {

                    if (is_array($value)) {
                        $validator->errors()->add("answers.$questionId", 'PAPI hanya boleh satu pilihan.');
                    }

                    $this->validateOptionOwnership($question, $value, $validator, $questionId);
                }

                /*
                =====================================
                CFIT Multiple Select (Subtest 2)
                =====================================
                */
                elseif ($question->type === Test::TYPE_MULTI) {

                    if (!is_array($value) || count($value) !== 2) {
                        $validator->errors()->add("answers.$questionId", 'Harus memilih tepat 2 jawaban.');
                        continue;
                    }

                    foreach ($value as $optionId) {
                        $this->validateOptionOwnership($question, $optionId, $validator, $questionId);
                    }
                }

                /*
                =====================================
                STANDARD & COMPARISON
                =====================================
                */
                else {

                    if (is_array($value)) {
                        $validator->errors()->add("answers.$questionId", 'Hanya boleh memilih satu jawaban.');
                    }

                    $this->validateOptionOwnership($question, $value, $validator, $questionId);
                }
            }
        });
    }

    /*
    ==================================================
    VALIDATE OPTION BELONGS TO QUESTION (ANTI CHEAT)
    ==================================================
    */
    private function validateOptionOwnership($question, $optionId, $validator, $questionId)
    {
        $exists = $question->options->where('id', $optionId)->count();

        if (!$exists) {
            $validator->errors()->add(
                "answers.$questionId",
                'Pilihan jawaban tidak valid untuk soal ini.'
            );
        }
    }
}
