<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PsychotestLink extends Model
{
    protected $fillable = [
        'uuid',
        'applicant_name',
        'applicant_email',
        'expires_at',
        'used_at',
        'results',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'results' => 'array',
    ];

    public function isExpired()
    {
        return $this->expires_at->isPast();
    }

    public function isUsed()
    {
        return !is_null($this->used_at);
    }
}
