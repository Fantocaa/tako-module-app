<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Tag;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Course::query()
            ->with(['tags', 'instructor'])
            ->where(function ($q) {
                $q->where('is_published', true)
                  ->orWhere('instructor_id', auth()->id());
            });

        // Filter by tag
        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $courses = $query->latest()->paginate(12)->withQueryString();

        $tags = Tag::orderBy('name')->get();

        return Inertia::render('courses/index', [
            'courses' => $courses,
            'tags' => $tags,
            'filters' => [
                'tag' => $request->tag,
                'search' => $request->search,
            ],
        ]);
    }

    public function indexCrud(Request $request): Response
    {
        $query = Course::query()
            ->with(['instructor'])
            ->when(!auth()->user()->hasRole('Super Admin'), function ($q) {
                // If not super admin, only show own courses? Or maybe all for now depending on requirements.
                // For now, let's show all but maybe unrelated to role for specific restrictions.
                // If strict: $q->where('instructor_id', auth()->id());
            })
            ->latest();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        // Filter by status if needed
        if ($request->filled('status')) {
             if ($request->status === 'published') {
                 $query->where('is_published', true);
             } elseif ($request->status === 'draft') {
                 $query->where('is_published', false);
             }
        }

        $courses = $query->paginate(12)->withQueryString();

        return Inertia::render('courses/crud/index', [
            'courses' => $courses,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('courses/create', [
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseRequest $request)
    {
        $validated = $request->validated();
        
        // Set instructor_id to current user
        $validated['instructor_id'] = auth()->id();

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $course = Course::create($validated);

        // Attach tags if provided
        if (isset($validated['tags'])) {
            $course->tags()->sync($validated['tags']);
        }

        return redirect()->route('courses.index')
            ->with('success', 'Course created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course): Response
    {
        $course->load(['lessons', 'tags', 'instructor']);

        return Inertia::render('courses/[slug]', [
            'course' => $course,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course): Response
    {
        $course->load('tags');
        $lessons = $course->lessons()->orderBy('order')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('courses/edit', [
            'course' => $course,
            'lessons' => $lessons,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseRequest $request, Course $course)
    {
        $validated = $request->validated();

        $course->update($validated);

        // Sync tags if provided
        if (isset($validated['tags'])) {
            $course->tags()->sync($validated['tags']);
        }

        return redirect()->route('courses.show', $course)
            ->with('success', 'Course updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
