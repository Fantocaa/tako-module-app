<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PapiAnswer extends Model
{
    use HasFactory;

    protected $table = 'papi_answers';

    protected $fillable = [
        'psychotest_link_id',
        'papi_question_id',
        'papi_option_id',
        'dimension_code',
        'score_value'
    ];

    protected $casts = [
        'score_value' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    // Relasi ke test session
    public function session()
    {
        return $this->belongsTo(PsychotestLink::class, 'psychotest_link_id');
    }

    // Relasi ke soal
    public function question()
    {
        return $this->belongsTo(PapiQuestion::class, 'papi_question_id');
    }

    // Relasi ke opsi yang dipilih
    public function option()
    {
        return $this->belongsTo(PapiOption::class, 'papi_option_id');
    }
}
