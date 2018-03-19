<!DOCTYPE html>
<html lang="en">
    <head>

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Next Month Trip</title>

        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Raleway', sans-serif;
                font-weight: 100;
                height: 100vh;
                margin: 0;
                padding: 40px 0;
            }
            .page-break {
                page-break-after: always;
            }

            .wrapper {
                padding: 20px 30px;
            }

            .title {
                font-size: 30px;
                text-align: center;
                padding: 20px 0px;
            }

            .date {
                text-align: center;
                font-size: 20px;
            }

            table {
                border-collapse: collapse;
                border: 1px solid black;
                padding: 10px;
                table-layout: fixed;
                width: 100%;
            }

            th, td {
                word-wrap: break-word;
                word-break: break-all;
                padding: 5px;
                max-width: 300px;
            }

        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="title">
                Next Month Plan of {{$username}}
            </div>
            <div class="date">
                ({{$start_date}} - {{$end_date}})
            </div>
            <div class="table">
                <table align="center" border="1">
                <thead>
                    <tr>
                        <th width="25%">Destination</th>
                        <th width="15%">Start Date</th>
                        <th width="15%">End Date</th>
                        <th width="45%">Comment</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($trips as $trip)
                    <tr>
                        <td width="25%">{{$trip->destination}}</td>
                        <td width="15%">{{$trip->start_date}}</td>
                        <td width="15%">{{$trip->end_date}}</td>
                        <td width="45%" style="overflow-wrap: break-word; word-break: break-all">{{$trip->comment}}</td>
                    </tr>
                    @endforeach
                </tbody>
                </table>
            </div>
        </div>
    </body>
</html>
