<?php

namespace App\Models;

use App\Models\Scopes\InstansiScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([InstansiScope::class])]
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
