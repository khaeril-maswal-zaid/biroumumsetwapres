<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('biroumum/home');
    }

    public function admin()
    {
        return Inertia::render('admin/home');
    }
}
