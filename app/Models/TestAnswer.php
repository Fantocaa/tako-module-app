<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestAnswer extends Model
{
    protected $table = 'test_answers';    
    protected $fillable = [
        'psychotest_link_id',
        'test_id',
        'test_option_id',
        'disc_choice_type',
    ];

    /*
    =========================
    RELATIONS
    =========================
    */

    public function psychotestLink()
    {
        return $this->belongsTo(PsychotestLink::class);
    }

    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    public function option()
    {
        return $this->belongsTo(TestOption::class, 'test_option_id');
    }

}
