<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Course $course): Response
    {
        $lessons = $course->lessons()->ordered()->get();

        return Inertia::render('courses/[slug]/lessons/index', [
            'course' => $course,
            'lessons' => $lessons,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Course $course): Response
    {
        return Inertia::render('courses/[slug]/lessons/create', [
            'course' => $course,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLessonRequest $request, Course $course)
    {
        $validated = $request->validated();
        
        // Set course_id
        $validated['course_id'] = $course->id;

        // Auto-increment order if not provided
        if (!isset($validated['order'])) {
            $maxOrder = $course->lessons()->max('order') ?? 0;
            $validated['order'] = $maxOrder + 1;
        }

        $lesson = Lesson::create($validated);

        return redirect()->route('courses.show', $course)
            ->with('success', 'Lesson created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course, Lesson $lesson): Response
    {
        $course->load(['lessons', 'tags', 'instructor']);
        
        $lessons = $course->lessons;
        $currentIndex = $lessons->search(fn($l) => $l->id === $lesson->id);
        
        $prevLesson = $currentIndex > 0 ? $lessons[$currentIndex - 1] : null;
        $nextLesson = $currentIndex < $lessons->count() - 1 ? $lessons[$currentIndex + 1] : null;

        return Inertia::render('courses/[slug]/lessons/[id]', [
            'course' => $course,
            'lesson' => $lesson,
            'lessons' => $lessons,
            'prevLesson' => $prevLesson,
            'nextLesson' => $nextLesson,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course, Lesson $lesson): Response
    {
        return Inertia::render('courses/[slug]/lessons/edit', [
            'course' => $course,
            'lesson' => $lesson,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLessonRequest $request, Course $course, Lesson $lesson)
    {
        $validated = $request->validated();

        $lesson->update($validated);

        return redirect()->route('courses.lessons.show', [$course, $lesson])
            ->with('success', 'Lesson updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course, Lesson $lesson)
    {
        $deletedOrder = $lesson->order;
        $lesson->delete();

        // Reorder remaining lessons
        $course->lessons()
            ->where('order', '>', $deletedOrder)
            ->decrement('order');

        return redirect()->route('courses.show', $course)
            ->with('success', 'Lesson deleted successfully.');
    }
}
