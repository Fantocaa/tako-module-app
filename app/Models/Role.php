<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    /**
     * Get the courses that can be accessed by this role.
     */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\Course::class, 'course_role');
    }
}
