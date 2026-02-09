<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    /*
    =========================
    TYPE CONSTANTS
    =========================
    */
    const TYPE_DISC = 'disc';
    const TYPE_FORCED = 'forced';
    const TYPE_MULTI = 'multi';

    protected $table = 'test';
    protected $fillable = [
        'section_id',
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

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function subtest()
    {
        return $this->belongsTo(TestSubtest::class, 'subtest_id');
    }

    public function options()
    {
        return $this->hasMany(TestOption::class);
    }

    public function answers()
    {
        return $this->hasMany(TestAnswer::class);
    }
}