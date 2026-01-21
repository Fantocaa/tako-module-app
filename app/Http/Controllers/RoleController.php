<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::with(['permissions', 'courses'])->get();
        $permissions = Permission::all()->groupBy('group');

        return Inertia::render('roles/Index', [
            'roles' => $roles,
            'groupedPermissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissions = Permission::all()->groupBy('group');
        $courses = \App\Models\Course::orderBy('title')->get(['id', 'title']);
        
        return Inertia::render('roles/Form', [
            'groupedPermissions' => $permissions,
            'courses' => $courses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'array',
            'courses' => 'array',
        ]);

        $role = Role::create(['name' => $data['name']]);
        $role->syncPermissions($data['permissions'] ?? []);
        
        // Sync courses
        if (isset($data['courses'])) {
            $role->courses()->sync($data['courses']);
        }

        return redirect()->route('roles.index')->with('success', 'Role created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $permissions = Permission::all()->groupBy('group');
        $courses = \App\Models\Course::orderBy('title')->get(['id', 'title']);
        $role->load(['permissions', 'courses']);
        
        return Inertia::render('roles/Form', [
            'role' => $role,
            'groupedPermissions' => $permissions,
            'courses' => $courses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $data = $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
            'permissions' => 'array',
            'courses' => 'array',
        ]);

        $role->update(['name' => $data['name']]);
        $role->syncPermissions($data['permissions'] ?? []);
        
        // Sync courses
        if (isset($data['courses'])) {
            $role->courses()->sync($data['courses']);
        }

        return redirect()->route('roles.index')->with('success', 'Role updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted');
    }
}
