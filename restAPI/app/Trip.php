<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'destination', 'start_date', 'end_date', 'comment'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'created_at', 'updated_at'
    ];

    /**
     * Get the user associated with the trip
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
