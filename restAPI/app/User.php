<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class User extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'password', 'user_type'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'api_token', 'created_at', 'updated_at'
    ];

    /**
     * Get the trips list associated with the user
     */
    public function trips()
    {
        return $this->hasMany('App\Trip', 'user_id', 'id');
    }
}
