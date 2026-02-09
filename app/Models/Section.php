<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Test;

class Section extends Model
{
    protected $fillable = [
        'section_name',
        'description',
        'is_active',
    ];

    /*
    =========================
    RELATIONS
    =========================
    */

    public function tests()
    {
        return $this->hasMany(Test::class);
    }

    public function subtests()
    {
        return $this->hasMany(TestSubtest::class);
    }

    public function psychotestLinks()
    {
        return $this->hasMany(PsychotestLink::class);
    }
}
