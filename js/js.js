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
    var _prs_from_issues_loader_url = $('#prs_route').val();
    var _commits_route = $('#prs_commit_route').val();
    var _files_changes_route = $('#files_route').val();
    var _all_commmits_route = $('#all_commits_route').val();

    var all_modules_routes = $('#all_modules_route').val();
    var all_estimations_route = $('#all_estimations_route').val();

    var commits_wo_email_reload = $('#commits_wo_email_routes').val();
    var all_vcs_file_revisions_route = $('#all_vcs_filerevisions_routes').val();
    var all_vcs_dates_rout = $('#all_vcsdates_routes').val();

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

    function setAllFields() {
        project_name = $('#project_name').val();

        project_label = $('#project_labels').val();
        base = $('#server_base').val();

        _project_route = $('#project_route').val();

        _issues_route = $('#issue_route').val();
        _prs_from_issues_loader_url = $('#prs_route').val();
        _commits_route = $('#prs_commit_route').val();
        _files_changes_route = $('#files_route').val();
        _all_commmits_route = $('#all_commits_route').val();

        all_modules_routes = $('#all_modules_route').val();
        all_estimations_route = $('#all_estimations_route').val();
        all_vcs_file_revisions_route = $('#all_vcs_filerevisions_routes').val();
        all_vcs_dates_rout = $('#all_vcsdates_routes').val();
    }
    $('#issueLoader').on('click', function () {
        setLabelsAndName();
        var theUrl = base + _issues_route +'?project_name='+project_name+
            // '&since=2016-03-24' +
            // '&until=2017-03-25' +
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
        setAllFields();
        var _i_url = base+_files_changes_route+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#allCommitsLoader').on('click', function () {
        setLabelsAndName();
        var theUrl = base + _all_commmits_route +'?project_name='+project_name+
            // '&since=2016-03-24' +
            // '&until=2017-03-25' +
            '&sort=created' +
            '&direction=asc' +
            '&per_page=100'+next_page();
        loadIssuesLoader(theUrl);

    });

    $('#allModulesLoader').on('click', function () {
        setLabelsAndName();
        setAllFields();
        var _i_url = base+all_modules_routes+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#allEstimationsLoader').on('click', function () {
        setLabelsAndName();
        setAllFields();
        var _i_url = base+all_estimations_route+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#vcsFileRevisionsLoader').on('click', function () {
        setLabelsAndName();
        setAllFields();
        var _i_url = base+all_vcs_file_revisions_route+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#WithoutEmailCommitsReloader').on('click', function () {
        setLabelsAndName();
        setAllFields();
        var _i_url = base+commits_wo_email_reload+'?project_name='+project_name;
        load_(_i_url);
    });

    $('#vcsDatesRevisionLoader').on('click', function () {
        setLabelsAndName();
        setAllFields();
        var _i_url = base+all_vcs_dates_rout+'?project_name='+project_name;
        load_(_i_url);
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


  /*  $('#tester').on('click', function () {
        var max = 70;
        var timToWait = 70,
            display = $('#timer');
        startTimer(timToWait, display);

    });*/

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

                        var $max_time = $('#time_to_wait').val()*1000;
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
                            (incr) +
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
                    incr++;
                    if(data.extra != 'covered' ){

                        $max_time = $('#time_to_wait').val()*1000;

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