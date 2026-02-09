<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PapiOption extends Model
{
    use HasFactory;

    protected $table = 'papi_options';

    protected $fillable = [
        'papi_question_id',
        'label',
        'content',
        'score_value'
    ];

    protected $casts = [
        'score_value' => 'integer',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    public function question()
    {
        return $this->belongsTo(PapiQuestion::class, 'papi_question_id');
    }
}
