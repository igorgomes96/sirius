// $('link').each(function () { // find all <link tags that have
// if ($(this).attr('rel').indexOf('stylesheet') !== -1) { // rel="stylesheet"
export const htmlImpressao = `<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />'
    <style>
      * {
          box-sizing: inherit;
      }
      html {
        line-height: 1.5;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
        font-weight: normal;
        color: rgba(0,0,0,0.87);
      }
      .card-action {
        display: none;
      }
      .flex-container {
          display: flex;
          flex-wrap: wrap;
      }
      .row {
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 20px;
      }
      .row .col {
        width: 50%;
        margin-left: auto;
        left: auto;
        right: auto;
        float: left;
        box-sizing: border-box;
        padding: 0 .75rem;
        min-height: 1px;
      }
      .flex-container > .col {
          margin-left: initial !important;
          display: grid;
       }
      .card {
          margin: .5rem 0 1rem 0;
          background-color: #fff;
          transition: box-shadow .25s;
          border-radius: 2px;
          box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
      }
      .card .card-content {
          padding: 24px;
          border-radius: 0 0 2px 2px;
      }
      .card .card-content .card-title {
          display: block;
          line-height: 32px;
          margin-bottom: 8px;
      }
      .card .card-title {
          font-size: 24px;
          font-weight: 300;
      }
      i.material-icons {
          font-size: inherit;
      }
      app-card-pedido {
          height: 100%;
          display: grid;
      }
      .horario {
          font-size: 12px;
      }
    </style>
    <body onload="window.focus(); window.print()">@DADOS</body>`;


/*html += '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />';
    html += `<style>
          * {
              box-sizing: inherit;
          }
          html {
            line-height: 1.5;
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
            font-weight: normal;
            color: rgba(0,0,0,0.87);
          }
          .card-action {
            display: none;
          }
          .flex-container {
              display: flex;
              flex-wrap: wrap;
          }
          .row {
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 20px;
          }
          .row .col {
            width: 50%;
            margin-left: auto;
            left: auto;
            right: auto;
            float: left;
            box-sizing: border-box;
            padding: 0 .75rem;
            min-height: 1px;
          }
          .flex-container > .col {
              margin-left: initial !important;
              display: grid;
           }
          .card {
              margin: .5rem 0 1rem 0;
              background-color: #fff;
              transition: box-shadow .25s;
              border-radius: 2px;
              box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
          }
          .card .card-content {
              padding: 24px;
              border-radius: 0 0 2px 2px;
          }
          .card .card-content .card-title {
              display: block;
              line-height: 32px;
              margin-bottom: 8px;
          }
          .card .card-title {
              font-size: 24px;
              font-weight: 300;
          }
          i.material-icons {
              font-size: inherit;
          }
          app-card-pedido {
              height: 100%;
              display: grid;
          }
          .horario {
              font-size: 12px;
          }
        </style>`;
    // }
    // });
    html += '<body onload="window.focus(); window.print()">' + $('#pedidos').html() + '</body>';*/
