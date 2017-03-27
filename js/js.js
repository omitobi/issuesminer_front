/**
 * Created by omitobisam on 10.03.17.
 */
$(document).ready(function() {

    var incr = 0;


    var project_name = $('#project_name').val();

    var project_label = $('#project_labels').val();
    var base = $('#server_base').val();

    var _project_route = $('#project_route').val();

    var _issues_route = $('#issue_route').val();
    var _prs_from_issues_loader_url = $('#prs_route');
    var _commits_route = $('#prs_commit_route').val();
    var _files_changes_route = $('#files_route').val();
    var _all_commmits_route = $('#all_commits_route').val();

    function next_page()  {
        return ($('#start_page').val() != 0) ?
        "&page="+$('#start_page').val() : "";
    }

    //Loading all projects first
    loadProjects();
    //Done!


//            var _issues_url = 'issues/prs/load?project_name=laravel'


    var  newfullissuesUrl = theUrl = base + _issues_route +'?project_name='+project_name+
        '&state=closed&sort=created' +
        '&direction=asc' +
        '&per_page=100&labels='+project_label;
    function setFullIssuesUrl(url) {

        newfullissuesUrl = url;

        return url;
    }

    function setLabelsAndName() {
        project_name = $('#project_name').val();
        project_label = $('#project_labels').val();
    }
    $('#issueLoader').on('click', function () {
        setLabelsAndName();
        var theUrl = base + _issues_route +'?project_name='+project_name+
            '&since=2016-03-24' +
            '&until=2017-03-25' +
            '&state=closed' +
            '&sort=created' +
            '&direction=asc' +
            '&per_page=100&labels='+project_label;

        loadIssuesLoader(theUrl);

    });

    $('#prsFromIssuesLoader').on('click', function () {
        setLabelsAndName();
        var _i_url = base+_prs_from_issues_loader_url+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#commitsLoader').on('click', function () {
        setLabelsAndName();
        var _i_url = base+_commits_route+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#commitsFilesLoader').on('click', function () {
        setLabelsAndName();
        var _i_url = base+_files_changes_route+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#allCommitsLoader').on('click', function () {
        setLabelsAndName();
        var theUrl = base + _all_commmits_route +'?project_name='+project_name+
            '&since=2016-03-24' +
            '&until=2017-03-25' +
            '&per_page=100'+next_page();
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
                        incr++;

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
                                incr +
                                "</td>" +
                                " <td> " +
                                data.message +
                                "</td>" +
                                " <td> " +
                                data.extra +
                                "</td>" +
                            "</tr>");


                        console.log(data.params);
                    } else {
                        incr++;
                        $('#status_table').find('tbody').append(
                            "<tr> " +
                                " <td> " +
                                incr +
                                "</td>" +
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
                            incr +
                            "</td>" +
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
                            incr +
                            "</td>" +
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


    $('#project_add').on('click', function () {
        var param = { url : $('#project_src').val()};
        var url = base+_project_route;

        addProject(url, param);
    });

    function addProject(_url, param)
    {
        $.ajax({
            url: _url,
            method: 'POST',
            dataType: 'json',
               data: param,
            success: function (data) {
                if(data.status === 'success')
                {
                    console.log(data);
                    alert(data.message);
                    // $('h1').text(data.message);
                    // $('h2').text(data.extra);


                }else {
                    console.log(data);
                    alert(data.message);
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

    function loadProjects()
    {

        $.ajax({
            url: base+_project_route+"?by=name",
            method: 'GET',
            dataType: 'json',
            // data: param,
            success: function (data) {
                if(data.status === 'success')
                {
                    console.log(data);
                    data.params.forEach( function (project, key) {
                        $('#project_name').append(
                          "<option value='"+project+"'>" +
                          project +
                          "</option>"
                        );
                    });
                    // alert(data.message);
                    // $('h1').text(data.message);
                    // $('h2').text(data.extra);


                }else {
                    console.log(data);
                    alert(data.message);
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