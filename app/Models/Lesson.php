<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'content_type',
        'video_url',
        'video_path',
        'content',
        'duration',
        'order',
        'is_published',
        'is_preview',
    ];

    protected $casts = [
        'content_type' => 'string',
        'duration' => 'integer',
        'order' => 'integer',
        'is_published' => 'boolean',
        'is_preview' => 'boolean',
    ];

    /**
     * Get the course that owns the lesson.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Scope a query to order lessons by order field.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order');
    }
}
