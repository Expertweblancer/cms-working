$(function() {

    var _url = $("#_url").val();

    var $ib_data_panel = $("#ib_data_panel");

    $ib_data_panel.block({ message:block_msg });

    var selected = [];
    var ib_act_hidden = $("#ib_act_hidden");
    function ib_btn_trigger() {
        if(selected.length > 0){
            ib_act_hidden.show(200);
        }
        else{
            ib_act_hidden.hide(200);
        }
    }


    $('[data-toggle="tooltip"]').tooltip();

    var ib_dt = $('#ib_dt').DataTable( {

        "serverSide": true,
        "ajax": {
            "url": base_url + "tickets/admin/json_list/",
            "type": "POST",
            "data": function ( d ) {

                d.account = $('#filter_account').val();
                d.email = $('#filter_email').val();
                d.company = $('#filter_company').val();
                d.status = $('#filter_status').val();
                d.subject = $('#filter_subject').val();



            }
        },
        "pageLength": 20,
        "rowCallback": function( row, data ) {
            if ( $.inArray(data.DT_RowId, selected) !== -1 ) {
                $(row).addClass('selected');

            }
        },
        responsive: true,
        dom: "<'row'<'col-sm-6'i><'col-sm-6'B>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'><'col-sm-7'p>>",
        fixedHeader: {
            headerOffset: 50
        },
        lengthMenu: [
            [ 10, 25, 50, -1 ],
            [ '10 rows', '25 rows', '50 rows', 'Show all' ]
        ],
        buttons: [
            {
                extend:    'pageLength',
                text:      '<i class="fa fa-bars"></i>',
                titleAttr: 'Entries'
            },
            {
                extend:    'selectAll',
                text:      '<i class="glyphicon glyphicon-ok-circle"></i>',
                titleAttr: 'Select All',
                action: function () {
                    ib_dt.rows().select();
                    $('.selected').each(function() {
                        selected.push( this.id );
                    });
                    ib_btn_trigger();

                }
            },
            {
                extend:    'selectNone',
                text:      '<i class="glyphicon glyphicon-remove-circle"></i>',
                titleAttr: 'Select All'
            },
            {
                extend:    'colvis',
                text:      '<i class="fa fa-columns"></i>',
                titleAttr: 'Columns'
            },
            {
                extend:    'copyHtml5',
                text:      '<i class="fa fa-files-o"></i>',
                titleAttr: 'Copy'
            },
            {
                extend:    'excelHtml5',
                text:      '<i class="fa fa-file-excel-o"></i>',
                titleAttr: 'Excel'
            },
            {
                extend:    'csvHtml5',
                text:      '<i class="fa fa-file-text-o"></i>',
                titleAttr: 'CSV'
            },
            {
                extend:    'pdfHtml5',
                text:      '<i class="fa fa-file-pdf-o"></i>',
                titleAttr: 'PDF'
            },
            {
                extend:    'print',
                text:      '<i class="fa fa-print"></i>',
                titleAttr: 'Print'
            }

        ],
        "columnDefs": [
            {
                "render": function ( data, type, row ) {
                    return '<a href="' + base_url +'tickets/admin/view/'+ row[5] +'">'+ data +'</a>';
                },
                "targets": 2
            },
            {
                "render": function ( data, type, row ) {
                    return '<a href="' + base_url +'contacts/view/'+ row[6] +'">'+ data +'</a>';
                },
                "targets": 3
            },
            { "orderable": false, "targets": 4 },
            { "orderable": false, "targets": 1 },
            { className: "text-center", "targets": [ 1 ] }
        ],
        "order": [[ 0, 'desc' ]],
        "scrollX": true,
        "initComplete": function () {
            $ib_data_panel.unblock();
        },
        select: {
            info: false
        }
    } );

    var $ib_filter = $("#ib_filter");


    $ib_filter.on('click', function(e) {
        e.preventDefault();

        $ib_data_panel.block({ message:block_msg });

        ib_dt.ajax.reload(
            function () {
                $ib_data_panel.unblock();
            }
        );


    });


    $('#ib_dt tbody').on('click', 'tr', function () {
        var id = this.id;
        var index = $.inArray(id, selected);

        if ( index === -1 ) {
            selected.push( id );
        } else {
            selected.splice( index, 1 );
        }

        $(this).toggleClass('selected');

        ib_btn_trigger();



    } );


    $ib_data_panel.on('click', '.cdelete', function(e){
        e.preventDefault();
        var lid = this.id;
        bootbox.confirm(_L['are_you_sure'], function(result) {
            if(result){

                $.get( base_url + "tickets/admin/delete/"+lid, function( data ) {
                    $ib_data_panel.block({ message:block_msg });

                    ib_dt.ajax.reload(
                        function () {
                            $ib_data_panel.unblock();
                        }
                    );
                });


            }
        });

    });



    // $("#assign_to_group").click(function(e){
    //     e.preventDefault();
    //
    // });

    $('#set_status').webuiPopover({
        type:'async',
        placement:'top',

        cache: false,
        width:'240',
        url: base_url + 'tickets/admin/available_status/'
    });

    $('body').on('change', '#bulk_status', function(e){

        $('.webui-popover').block({ message: block_msg});

        $.post( base_url + "tickets/admin/set_status/", { status: $('#bulk_status').val(), ids: selected })
            .done(function( data ) {

                $('.webui-popover').unblock();
                $ib_data_panel.block({ message:block_msg });
                ib_dt.ajax.reload(
                    function () {
                        $ib_data_panel.unblock();
                    }
                );

                toastr.success(data);


            });



    });

    $("#delete_multiple_customers").click(function(e){
        e.preventDefault();
        bootbox.confirm(_L['are_you_sure'], function(result) {
            if(result){
                $.redirect(base_url + "tickets/admin/delete_multiple/",{ type: "tickets", ids: selected});
            }
        });

    });




});