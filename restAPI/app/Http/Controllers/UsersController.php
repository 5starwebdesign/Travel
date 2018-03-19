<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\User;
use App\Http\Responses\ApiResponse;

class UsersController extends Controller
{
	/**
     *
     * Authenticate a user
     *
     * @param Request $request
     * @return ApiResponse
     */
    public function login(Request $request)
    {
        $userData = $request->only(
            ['username', 'password']
        );

        $validator = Validator::make($userData, [
            'username' => 'required',
            'password' => 'required'
        ]);

        if($validator->fails()){
            return new ApiResponse($validator->errors(), true, 500);
        }

        $user = User::where('username', $userData['username'])->first();

        if (!$user) {
        	return new ApiResponse(trans('Invalid login credential!'), true, 500);
        }

        if(!Hash::check($userData['password'], $user->password)) {
            return new ApiResponse(trans('Invalid login credential!'), true, 500);
        }

        $user->api_token = str_random(60);

        $user->save();

        return new ApiResponse($user, false, 200, $user->api_token);
    }

    /**
     *
     * Create a user
     *
     * @param Request $request
     * @return ApiResponse
     */
    public function create(Request $request)
    {
        $postData = $request->only(['username', 'password', 'user_type']);

        $validator = Validator::make($postData, [
            'username' 	=> 'required|unique:users|min:4|max:64',
            'password' 	=> 'required|min:4',
            'user_type' => 'required|integer|in:0,1,2'
        ]);

        if($validator->fails()){
            return new ApiResponse($validator->errors(), true, 500);
        }

        $password = $postData['password'];

        if($password){
            $postData['password'] = Hash::make($password);
        }

        $user = new User();
        $user->fill($postData);

        $currentUser = $request->attributes->get('currentUser');

        if ($currentUser) {
        	if ($currentUser['user_type'] == config('constants.RegularUser')) {
        		return new ApiResponse(trans('No permission to the users!'), true, 403);
        	} else if ($currentUser['user_type'] == config('constants.UserManager') && $postData['user_type'] <= config('constants.UserManager')) {
        		return new ApiResponse(trans('No permssion to the usermanagers or admins!'), true, 403);
        	}
        } else {
        	if ($postData['user_type'] <= config('constants.UserManager')) {
        		return new ApiResponse(trans('No permission to the usermanagers or admins!'), true, 403);
        	}
        	$user->api_token = str_random(60);
        }

        $user->save();

        if (!$currentUser) {
        	return new ApiResponse($user, false, 200, $user->api_token);
        }

        return new ApiResponse($user);
    }

    /**
     *
     * Retrieve users list
     *
     * @param Request $request
     * @return ApiResponse
     */
    public function index(Request $request)
    {
        $currentUser = $request->attributes->get('currentUser');

        if ($currentUser['user_type'] == config('constants.RegularUser')) {
        	return new ApiResponse(trans('No permission to the users!'), true, 403);
        }

        $users = User::get();

        if ($currentUser['user_type'] == config('constants.UserManager')) {
        	$users = User::where('user_type', config('constants.RegularUser'))->get();
        }

        return new ApiResponse($users);
    }

    /**
     *
     * Get a user
     *
     * @param Request $request, $userId
     * @return ApiResponse
     */
    public function getCurrentUser(Request $request, $userId)
    {
        $currentUser = $request->attributes->get('currentUser');

        if ($currentUser['user_type'] == config('constants.RegularUser')) {
        	return new ApiResponse(trans('No permission to the users!'), true, 403);
        } 

        $user = User::find($userId);
        if (!$user) {
      		return new ApiResponse(trans('Cannot find any user with the user id!'), true, 500);
        }

        if ($currentUser['user_type'] == config('constants.UserManager') && $user['user_type'] <= config('constants.UserManager')) {
        	return new ApiResponse(trans('No permission to the usermanagers or admins!'), true, 403);
        }

        return new ApiResponse($user);
    }

    /**
     *
     * Update a user
     *
     * @param Request $request, $userId
     * @return ApiResponse
     */
    public function updateCurrentUser(Request $request, $userId)
    {
        $currentUser = $request->attributes->get('currentUser');

        if ($currentUser['user_type'] == config('constants.RegularUser')) {
        	return new ApiResponse(trans('No permission to the users!'), true, 403);
        } 

        $postData = $request->all();

        $validator = Validator::make($postData, [
            'username' 	=> ['sometimes', 'min:4', 'max:64', Rule::unique('users')->ignore($userId)],
            'password' 	=> 'sometimes|min:4',
            'user_type' => 'sometimes|integer|in:0,1,2'
        ]);

        if($validator->fails()){
            return new ApiResponse($validator->errors(), true, 500);
        }

        $password = $request->input('password', false);

        if($password){
            $postData['password'] = Hash::make($password);
        }
        
        $user = User::find($userId);
        if (!$user) {
      		return new ApiResponse(trans('Cannot find any user with the user id!'), true, 500);
        }

        if ($currentUser['user_type'] == config('constants.UserManager') && $user['user_type'] <= config('constants.UserManager')) {
        	return new ApiResponse(trans('No permission to the usermanagers or admins!'), true, 403);
        }

         else {
            $user->fill($postData);
        }

        $user->save();

        return new ApiResponse($user);
    }

    /**
     *
     * Delete a user
     *
     * @param Request $request, $userId
     * @return ApiResponse
     */
    public function deleteCurrentUser(Request $request, $userId)
    {
        $currentUser = $request->attributes->get('currentUser');

        if ($currentUser['user_type'] == config('constants.RegularUser')) {
        	return new ApiResponse(trans('No permission to the users!'), true, 403);
        }

        if ($userId == $currentUser['id']) {
            return new ApiResponse(trans('No permission to delete yourself!'), true, 403);
        }
        
        $user = User::find($userId);
        if (!$user) {
      		return new ApiResponse(trans('Cannot find any user with the user id!'), true, 500);
        }

        if ($currentUser['user_type'] == config('constants.UserManager') && $user['user_type'] <= config('constants.UserManager')) {
        	return new ApiResponse(trans('No permission to the usermanagers or admins!'), true, 403);
        }

        $user->delete();

        return new ApiResponse(trans('user.deleted'));
    }

    /**
     *
     * Logout the current user
     *
     * @param Request $request
     * @return ApiResponse
     */
    public function logout(Request $request)
    {
        $currentUser = $request->attributes->get('currentUser');

        $currentUser->api_token = str_random(60);

        $currentUser->save();
        return new ApiResponse(trans('user.logged.out'));
    }
}
