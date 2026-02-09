<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PapiScore extends Model
{
    protected $fillable = [
        'psychotest_link_id',
        'dimension_code',
        'total_score',
    ];
}