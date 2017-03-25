/**
 * Created by omitobisam on 10.03.17.
 */
$(document).ready(function() {

    var project_name = "bitcoin";
    var project_label = 'Bug';
    var base = 'http://localhost:8001/';
    var _project_route = 'projects';
    var _issues_route = 'issues/load';
    var _commits_route = 'prs/commits/load';
    var _files_changes_route = 'commits/files/load';
    var _prs_from_issues_loader_url = 'issues/prs/load';
    var _all_commmits_route = 'commits';
//            var _issues_url = 'issues/prs/load?project_name=laravel'


    function getTheURL(url) {
        if(url === '')
        {
            return 'issues/load/' +
                '?project_name=laravel' +
                '&state=closed&sort=created' +
                '&direction=asc' +
                '&since=2000-01-01T00:00:01Z' +
                '&per_page=100&page=2'
        }

        return url;
    }

    $('#issueLoader').on('click', function () {
        var theUrl = base + _issues_route +'?project_name='+project_name+
            '&state=closed&sort=created' +
            '&direction=asc' +
            '&per_page=100&labels='+project_label;
        loadIssuesLoader(theUrl);
    });

    $('#prsFromIssuesLoader').on('click', function () {
        var _i_url = base+_prs_from_issues_loader_url+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#commitsLoader').on('click', function () {
        var _i_url = base+_commits_route+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#commitsFilesLoader').on('click', function () {
        var _i_url = base+_files_changes_route+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#allCommitsLoader').on('click', function () {
        var theUrl = base + _all_commmits_route +'?project_name='+project_name+
            '&since=2016-03-24' +
            '&until=2017-03-25' +
            '&per_page=100&page=5';
        loadIssuesLoader(theUrl);

    });

    function startTimer(duration, display) {
        var timer = duration, minutes, seconds;
        setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.text(minutes + ":" + seconds);

            if (--timer < 0) {
                timer = duration;
            }
        }, 1000);
    }


    $('#tester').on('click', function () {
        var max = 70;
        var timToWait = 70,
            display = $('#timer');
        startTimer(timToWait, display);

    });

    function loadIssuesLoader(_url) {

        $.ajax({
            url: _url,
            method: 'GET',
            dataType: 'json',
//                data: formData,
            success: function (data) {
                if (data.status === 'success') {
                    if (data.extra != 'covered') {
                        var $max_time = 70000;

                        var timToWait = $max_time/1000,
                            display = $('#timer');
                        startTimer(timToWait, display);

                        setTimeout(function(){
                            loadIssuesLoader(
                                base+
                                ((data.model == 'commits') ? _all_commmits_route : _issues_route)+
                                '?'+
                                data.params);
                            console.log(base+_issues_route+'?'+data.params);
                        },$max_time);  //after 70 seconds

                        $('#status_table').find('tbody').append(
                            "<tr> " +
                                " <td> " +
                                data.message +
                                "</td>" +
                                " <td> " +
                                data.extra +
                                "</td>" +
                            "</tr>");


                        console.log(data.params);
                    } else {
                        $('#status_table').find('tbody').append(
                            "<tr> " +
                            " <td> " +
                            data.message +
                            "</td>" +
                            " <td> " +
                            data.extra +
                            "</td>" +
                            "</tr>");
                    }
//                            $('h1').text(data.message);
//                            $('h2').text(data.extra);
//                            console.log(data);
                }
            },
            error: function (data) {
                /*console.log('Noo');*/
                $('h1').text(data.message);
                $('h2').text(data.extra);
                alert(data.message);
                console.log(data);
                return ;
            }
        });
    }



    function load_(_url) {
        $.ajax({
            url: _url,
            method: 'GET',
            dataType: 'json',
//                data: formData,
            success: function (data) {
                if(data.status === 'success')
                {
                    if(data.extra != 'covered' ){

                        var $max_time = 70000;

                        var timToWait = $max_time/1000,
                            display = $('#timer');
                        startTimer(timToWait, display);

                        setTimeout(function(){
                            load_(_url);
                        },$max_time);  //after 70 seconds

                        $('#status_table').find('tbody').append(
                            "<tr> " +
                            " <td> " +
                            data.message +
                            "</td>" +
                            " <td> " +
                            data.extra +
                            "</td>" +
                            "</tr>");

                        console.log(data);
                    } else {
                        $('#status_table').find('tbody').append(
                            "<tr> " +
                            " <td> " +
                            data.message +
                            "</td>" +
                            " <td> " +
                            data.extra +
                            "</td>" +
                            "</tr>");
                        console.log(data);
                    }
                    // $('h1').text(data.message);
                    // $('h2').text(data.extra);
                }
            },
            error: function (data) {
                // $('h1').text(data.message);
                // $('h2').text(data.extra);
                alert(data.message);
                console.log(data);
            }
        });
    }




});