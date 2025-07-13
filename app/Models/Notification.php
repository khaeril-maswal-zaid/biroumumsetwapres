<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'category',
        'title',
        'message',
        'priority',
        'action_url',
        'is_read',
    ];
}
