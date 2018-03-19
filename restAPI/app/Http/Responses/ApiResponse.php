<?php

namespace App\Http\Responses;

use Illuminate\Http\Response;

class ApiResponse extends Response {


    /**
     * @SWG\Property()
     * @var bool
     */
    public $ERROR;
    /**
     * @SWG\Property
     * @var int
     */
    public $RESPONSE_CODE;
    /**
     * @SWG\Property
     * @var string
     */
    public $RESPONSE;

    public function __construct($responseContent, $isError = false, $responseCode = 200, $api_token = '')
    {
        if ($api_token != '') {
            parent::__construct([
                "ERROR" => $isError,
                "RESPONSE_CODE" => $responseCode,
                "RESPONSE" => $responseContent,
                "API_TOKEN" => $api_token
            ], $responseCode);
        } else {
            parent::__construct([
                "ERROR" => $isError,
                "RESPONSE_CODE" => $responseCode,
                "RESPONSE" => $responseContent
            ], $responseCode);
        }
        
    }

}