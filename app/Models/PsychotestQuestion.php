<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PsychotestQuestion extends Model
{
    protected $fillable = [
        'test_type',
        'session_number',
        'section_number',
        'question_number',
        'type',
        'content',
        'options',
    ];

    protected $casts = [
        'content' => 'array',
        'options' => 'array',
    ];
}
