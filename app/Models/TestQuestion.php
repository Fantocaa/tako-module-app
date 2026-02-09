<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestQuestion extends Model
{
    protected $fillable = [
        'subtest_id',
        'question_text',
        'type',
        'order',
    ];

    /*
    =========================
    RELATIONS
    =========================
    */

    
    public function subtest()
    {
        return $this->belongsTo(TestSubtest::class, 'subtest_id');
    }

    public function options()
    {
        return $this->hasMany(TestOption::class, 'question_id');
    }
    

    public function answers()
    {
        return $this->hasMany(TestAnswer::class, 'question_id');
    }
}