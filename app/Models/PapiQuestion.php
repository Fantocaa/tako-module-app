<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PapiQuestion extends Model
{
    use HasFactory;

    protected $table = 'papi_questions';

    protected $fillable = [
        'type',
        'dimension_code'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    // 1 Soal memiliki 2 opsi (A dan B)
    public function options()
    {
        return $this->hasMany(PapiOption::class);
    }

    /*
    |--------------------------------------------------------------------------
    | HELPER ACCESSOR
    |--------------------------------------------------------------------------
    */

    public function getOptionAAttribute()
    {
        return $this->options->where('label', 'A')->first();
    }
    public function answers()
{
    return $this->hasMany(PapiAnswer::class);
}

public function dimension()
{
    return $this->belongsTo(PapiDimension::class, 'dimension_code', 'code');
}

}
