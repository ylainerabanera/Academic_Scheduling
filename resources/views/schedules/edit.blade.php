@extends('layouts.app')

@section('content')
<div class="container">
    <h3 class="mb-3">Edit Schedule</h3>

    <form method="POST" action="{{ route('schedules.update', $schedule) }}" class="card card-body"
        data-schedule-form
        data-matching-colors='@json($matchingColors)'
        data-inherited-color="{{ $inheritedColor ?? '' }}">
        @csrf
        @method('PUT')
        @include('schedules.partials.form', ['schedule' => $schedule])
        <button class="btn btn-primary">Update</button>
        <a class="cancel-link mt-3 text-center" href="{{ route('schedules.index') }}">Cancel</a>
    </form>
</div>
@endsection
