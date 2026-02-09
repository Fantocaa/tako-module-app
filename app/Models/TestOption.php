<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestOption extends Model
{
    protected $fillable = [
        'test_id',
        'content',
        'dimension_code',
        'is_correct',
        'score',
    ];
    protected $table = 'test_options';
    protected $casts = [
        'is_correct' => 'boolean',
    ];

    /*
    =========================
    RELATIONS
    =========================
    */

    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    public function answers()
    {
        return $this->hasMany(TestAnswer::class);
    }
}
