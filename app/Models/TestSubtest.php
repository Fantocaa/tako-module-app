<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Test;
use App\Models\Section;
use App\Models\TestQuestion;


class TestSubtest extends Model
{
    protected $fillable = [
        'section_id',
        'name',
        'duration_seconds',
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

    public function tests()
    {
        return $this->hasMany(Test::class, 'subtest_id');
    }
    public function test()
{
    return $this->belongsTo(Test::class);
}

    public function questions()
    {
        return $this->hasMany(TestQuestion::class, 'subtest_id');
    }
}
