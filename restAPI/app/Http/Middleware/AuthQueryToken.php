<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiResponse;
use App\User;
use Closure;

class AuthQueryToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = $request->only('token');

        $user = User::where('api_token', $token)->first();

        if($user == null) {
            return new ApiResponse(trans('user.invalid_token'), true, 401);
        }

        $request->attributes->add(['currentUser' => $user]);

        return $next($request);
    }
}
