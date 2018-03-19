<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiResponse;
use App\User;
use Closure;

class AuthToken
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
        $authHeader = $request->header('Authorization');

        preg_match('/^\s?Token\s(.+)$/', $authHeader, $matches);

        if(count($matches) != 2){
            return new ApiResponse(trans('user.no_token_header'), true, 401);
        }

        $token = $matches[1];

        $user = User::where('api_token', $token)->first();

        if($user == null) {
            return new ApiResponse(trans('user.invalid_token'), true, 401);
        }

        $request->attributes->add(['currentUser' => $user]);

        return $next($request);
    }
}
