<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade as PDF;
use App\User;
use App\Trip;
use App\Http\Responses\ApiResponse;

class TripsController extends Controller
{
    /**
     *
     * Retrieve the current user's trips list
     *
     * @param Request $request, $userId
     * @return ApiResponse
     */
    public function getCurrentUserTrips(Request $request, $userId)
    {
        $currentUser = $request->attributes->get('currentUser');

		if ($currentUser['user_type'] == config('constants.UserManager')) {
        	return new ApiResponse(trans('No permission to the trips!'), true, 403);
        }

        $data = $request->all();

        $validator = Validator::make($data, [
            'start_date' 	=> 'sometimes|date',
            'end_date' 		=> 'required_with:start_date|date|after:start_date',
            'destination'   => 'sometimes|max:50',
            'comment'       => 'sometimes|max:255'
        ]);

        if($validator->fails()){
            return new ApiResponse($validator->errors(), true, 500);
        }

        if ($currentUser['user_type'] == config('constants.RegularUser') && $currentUser['id'] != $userId) {
        	return new ApiResponse(trans('No permission to the others trips!'), true, 403);
        }

        $user = User::find($userId);
        if (!$user) {
        	return new ApiResponse(trans('Cannot find any user with the user id!'), true, 500);
        }

        if ($user['user_type'] <= config('constants.UserManager')) {
        	return new ApiResponse(trans('Usermanager or Admin cannot have their trips!'), true, 500);
        }

        $queryMatch[] = ['user_id', '=' , $userId];

        if (isset($data['start_date']) && $data['start_date'] != '') {
            $queryMatch[] = ['start_date', '<=', $data['end_date']];
            $queryMatch[] = ['end_date', '>=', $data['start_date']];
        }
        if (isset($data['destination']) && $data['destination'] != '') {
            $queryMatch[] = ['destination', 'like', '%'.$data['destination'].'%'];
        }
        if (isset($data['comment']) && $data['comment'] != '') {
            $queryMatch[] = ['comment', 'like', '%'.$data['comment'].'%'];
        }

        return new ApiResponse(Trip::where($queryMatch)->get());
        
    }

    /**
     *
     * Create a trip
     *
     * @param Request $request, $userId
     * @return ApiResponse
     */
    public function create(Request $request, $userId)
    {
        $currentUser = $request->attributes->get('currentUser');

		if ($currentUser['user_type'] == config('constants.UserManager')) {
        	return new ApiResponse(trans('No permission to the trips!'), true, 403);
        }

        $data = $request->only(['destination', 'start_date', 'end_date', 'comment']);

        $validator = Validator::make($data, [
            'start_date' 	=> 'required|date',
        ]);

        if(!$validator->fails()){
        	$data['start_date'] = date('Y-m-d', strtotime($data['start_date'] . ' -1 day'));
    	}

        $validator = Validator::make($data, [
        	'destination'   => 'required|min:1|max:50',
            'start_date' 	=> 'required|date',
            'end_date' 		=> 'required|date|after:start_date',
            'comment'		=> 'required|min:1|max:255'
        ]);

        if($validator->fails()){
            return new ApiResponse($validator->errors(), true, 500);
        } else {
        	$data['start_date'] = date('Y-m-d', strtotime($data['start_date'] . ' +1 day'));
        }

        $user = User::find($userId);

        if (!$user) {
        	return new ApiResponse(trans('Cannot find any user with the user id!'), true, 500);
        }

        $userTrips = $user->trips;
        $is_valid = true;

        if ($userTrips && count($userTrips) != 0) {
        	foreach ($userTrips as $userTrip) {
        		if ($data['start_date'] <= $userTrip['end_date'] && $data['end_date'] >= $userTrip['start_date']) {
        			$is_valid = false;
        			break;
        		}
        	}
        }

        if (!$is_valid) {
        	return new ApiResponse(['start_date' => ['A user cannot travel two place at the same time. Please make sure you entered start date and end date correctly!']], true, 500);
        }

		if ($user['user_type'] <= config('constants.UserManager')) {
        	return new ApiResponse(trans('Usermanager or Admin cannot have their trips!'), true, 500);
        }

        if ($currentUser['user_type'] == config('constants.RegularUser') && $currentUser['id'] != $userId) {
        	return new ApiResponse(trans('No permission to the others trips!'), true, 403);
        }

        $trip = new Trip();
        $trip->fill($data);
        $trip->user_id = $userId;

        $trip->save();

        return new ApiResponse($trip);
    }

    /**
     *
     * Update a trip
     *
     * @param Request $request, $tripId
     * @return ApiResponse
     */
    public function updateCurrentTrip(Request $request, $tripId)
    {
        $currentUser = $request->attributes->get('currentUser');

		if ($currentUser['user_type'] == config('constants.UserManager')) {
        	return new ApiResponse(trans('No permission to the trips!'), true, 403);
        }

        $data = $request->all();

        $validator = Validator::make($data, [
            'start_date' 	=> 'required|date'
        ]);
        
        if(!$validator->fails()){
        	$data['start_date'] = date('Y-m-d', strtotime($data['start_date'] . ' -1 day'));
    	}

        $validator = Validator::make($data, [
        	'destination'   => 'sometimes|min:1|max:50',
            'start_date' 	=> 'sometimes|date',
            'end_date' 		=> 'required_with:start_date|date|after:start_date',
            'comment'		=> 'sometimes|min:1|max:255'
        ]);

        if($validator->fails()){
            return new ApiResponse($validator->errors(), true, 500);
        } else {
        	$data['start_date'] = date('Y-m-d', strtotime($data['start_date'] . ' +1 day'));
        }

        $trip = Trip::find($tripId);
        if (!$trip) {
        	return new ApiResponse(trans('Cannot find any trip with the trip id!'), true, 500);
        }

        if ($currentUser['user_type'] == config('constants.RegularUser') && $currentUser['id'] != $trip['user_id']) {
        	return new ApiResponse(trans('No permission to the others trips!'), true, 403);
        }

        $user = User::find($trip['user_id']);
        if (!$user) {
        	return new ApiResponse(trans('Cannot find any user with this trip!'), true, 500);
        }

        $userTrips = $user->trips;
        $is_valid = true;

        if ($userTrips && count($userTrips) != 0) {
        	foreach ($userTrips as $userTrip) {
        		if ($data['start_date'] <= $userTrip['end_date'] && $data['end_date'] >= $userTrip['start_date'] && $userTrip['id'] != $tripId) {
        			$is_valid = false;
        			break;
        		}
        	}
        }

        if (!$is_valid) {
        	return new ApiResponse(['start_date' => ['A user cannot travel two place at the same time. Please make sure you entered start date and end date correctly!']], true, 500);
        }

        if ($user['user_type'] <= config('constants.UserManager')) {
        	return new ApiResponse(trans('Usermanager or Admin cannot have their trips!'), true, 500);
        }

        $trip->fill($data);

        $trip->save();

        return new ApiResponse($trip);
    }

     /**
     *
     * Delete a trip
     *
     * @param Request $request, $tripId
     * @return ApiResponse
     */
    public function deleteCurrentTrip(Request $request, $tripId)
    {
        $currentUser = $request->attributes->get('currentUser');

		if ($currentUser['user_type'] == config('constants.UserManager')) {
        	return new ApiResponse(trans('No permission to the trips!'), true, 403);
        }

        $trip = Trip::find($tripId);
        if (!$trip) {
        	return new ApiResponse(trans('Cannot find any trip with the trip id!'), true, 500);
        }

        if ($currentUser['user_type'] == config('constants.RegularUser') && $currentUser['id'] != $trip['user_id']) {
        	return new ApiResponse(trans('No permission to the others trips!'), true, 403);
        }

        $user = User::find($trip['user_id']);
        if (!$user) {
        	return new ApiResponse(trans('Cannot find any user with this trip!'), true, 500);
        }

        if ($user['user_type'] <= config('constants.UserManager')) {
        	return new ApiResponse(trans('Usermanager or Admin cannot have their trips!'), true, 500);
        }

        $trip->delete();

        return new ApiResponse(trans('trip.deleted'));
    }

    /**
     *
     * Retrieve a trip
     *
     * @param Request $request, $tripId
     * @return ApiResponse
     */
    public function getCurrentTrip(Request $request, $tripId)
    {
        $currentUser = $request->attributes->get('currentUser');

		if ($currentUser['user_type'] == config('constants.UserManager')) {
        	return new ApiResponse(trans('No permission to the trips!'), true, 403);
        }

        $trip = Trip::find($tripId);
        if (!$trip) {
        	return new ApiResponse(trans('Cannot find any trip with the trip id!'), true, 500);
        }

        if ($currentUser['user_type'] == config('constants.RegularUser') && $currentUser['id'] != $trip['user_id']) {
        	return new ApiResponse(trans('No permission to the others trips!'), true, 403);
        }

        $user = User::find($trip['user_id']);

        if (!$user) {
        	return new ApiResponse(trans('Cannot find any user with this trip!'), true, 500);
        }

        if ($user['user_type'] <= config('constants.UserManager')) {
        	return new ApiResponse(trans('Usermanager or Admin cannot have their trips!'), true, 500);
        }

        return new ApiResponse($trip);
    }

    /**
    * Print trips of this user for next month to PDF
    */
    public function print(Request $request, $userId)
    {
        $from_date = date('Y-m-d', strtotime("first day of next month"));
        $to_date = date('Y-m-d', strtotime("last day of next month"));

        $queryMatch = [
            ['user_id', '=', $userId],
            ['start_date', '<=', $to_date],
            ['end_date', '>=', $from_date],
        ];

        $trips = Trip::where($queryMatch)->get();
        $user = User::find($userId);
        
        $pdf = PDF::loadView('pdf', ['trips' => $trips, 'start_date' => $from_date, 'end_date' => $to_date, 'username' => $user['username']]);
        return $pdf->stream('nextMonthPlan.pdf', ['Attachment' => 0]);
    }

    /**
    * Print trips of this user for next month to PDF
    */
    public function print_web(Request $request, $userId)
    {
        $from_date = date('Y-m-d', strtotime("first day of next month"));
        $to_date = date('Y-m-d', strtotime("last day of next month"));

        $queryMatch = [
            ['user_id', '=', $userId],
            ['start_date', '<=', $to_date],
            ['end_date', '>=', $from_date],
        ];

        $trips = Trip::where($queryMatch)->get();

        return view('pdf', ['trips' => $trips]);
    }
}
