<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePermintaanAtkStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,partial,confirmed,reject',

            'items' => 'sometimes|array',
            'items.*' => 'integer|min:0',

            'partialApprovals' => 'sometimes|array',
            'partialApprovals.*.approve' => 'required|integer|min:0',

            'newRequests' => 'sometimes|array',
            'newRequests.*.originalItemId' => 'required|string',
            'newRequests.*.id' => 'required|integer',
            'newRequests.*.requested' => 'required|integer|min:1',
            'newRequests.*.approved' => 'required|integer|min:0',

            'message' => 'nullable|string|max:255',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($v) {
            $permintaan = $this->route('permintaanAtk'); // ambil dari route model binding
            $currentStatus = $permintaan?->status;

            if ($currentStatus === 'pending') {
                if ($this->filled('partialApprovals')) {
                    $v->errors()->add(
                        'partialApprovals',
                        'Tidak boleh mengirim partialApprovals saat status permintaan masih pending.'
                    );
                }
            }

            if ($currentStatus === 'partial') {
                if ($this->filled('items')) {
                    $v->errors()->add(
                        'items',
                        'Tidak boleh mengirim items saat status permintaan sudah partial.'
                    );
                }
            }

            if ($currentStatus === 'confirmed') {
                if (
                    $this->filled('items') ||
                    $this->filled('partialApprovals') ||
                    $this->filled('newRequests')
                ) {
                    $v->errors()->add(
                        'status',
                        'Permintaan yang sudah confirmed tidak boleh menerima perubahan.'
                    );
                }
            }
        });
    }

}
