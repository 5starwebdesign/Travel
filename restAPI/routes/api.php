<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/user/authenticate', 'UsersController@login');
Route::post('/user/register', 'UsersController@create');
Route::get('/user/logout', 'UsersController@logout')->middleware('auth.token');
Route::get('/user', 'UsersController@index')->middleware('auth.token');
Route::post('/user', 'UsersController@create')->middleware('auth.token');
Route::get('/user/{userId}', 'UsersController@getCurrentUser')->middleware('auth.token');
Route::put('/user/{userId}', 'UsersController@updateCurrentUser')->middleware('auth.token');
Route::delete('/user/{userId}', 'UsersController@deleteCurrentUser')->middleware('auth.token');

Route::post('/trip/{userId}', 'TripsController@create')->middleware('auth.token');
Route::get('/trip/{userId}', 'TripsController@getCurrentUserTrips')->middleware('auth.token');
Route::put('/trip/{tripId}', 'TripsController@updateCurrentTrip')->middleware('auth.token');
Route::delete('/trip/{tripId}', 'TripsController@deleteCurrentTrip')->middleware('auth.token');
Route::get('/print/{userId}', 'TripsController@print')->middleware('auth.queryToken');
