<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePemesananRuangRapatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_code'   => 'required|string|exists:daftar_ruangans,kode_ruangan',
            'date'        => 'required|date',
            'startTime'   => 'required|date_format:H:i',
            'endTime'     => 'required|date_format:H:i|after_or_equal:startTime',
            'purpose'     => 'required|string|max:255',
            'contact'     => 'required|string|max:15',
            'jenisRapat'  => 'string|in:internal,external',
            'needItSupport' => 'boolean',
            'isHybrid'  => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'room_code.required'    => 'Kode ruangan wajib diisi.',
            'room_code.exists'      => 'Kode ruangan tidak ditemukan.',
            'date.required'         => 'Tanggal penggunaan wajib diisi.',
            'date.date'             => 'Tanggal tidak valid.',
            'startTime.required'    => 'Jam mulai wajib diisi.',
            'startTime.date_format' => 'Format jam mulai harus HH:MM.',
            'endTime.required'      => 'Jam selesai wajib diisi.',
            'endTime.date_format'   => 'Format jam selesai harus HH:MM.',
            'endTime.after_or_equal' => 'Jam selesai harus sama atau setelah jam mulai.',
            'purpose.required'      => 'Tujuan pemesanan wajib diisi.',
            'contact.required'      => 'Nomor kontak wajib diisi.',
            'contact.max'           => 'Nomor kontak maksimal 15 karakter.',
            'jenisRapat.in'         => 'Jenis rapat harus berupa internal atau external.',
            'needItSupport.boolean' => 'Need IT Support harus berupa nilai boolean.',
            'isHybrid.boolean'      => 'Is Hybrid harus berupa nilai boolean.',
        ];
    }
}
