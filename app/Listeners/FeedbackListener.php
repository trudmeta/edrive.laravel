<?php

namespace App\Listeners;

use App\Events\FeedbackEvent;
use App\Mail\FeedbackMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class FeedbackListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     * @param FeedbackEvent $event
     */
    public function handle(FeedbackEvent $event): void
    {
        $data = $event->data;

        Mail::to(User::first())->send(new FeedbackMail($data));
    }
}
