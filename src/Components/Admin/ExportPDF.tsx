import {
  GetListUser,
  GetListReportsFinished,
  GetListActivity,
  GetListArtistForm,
  GetListAllTransactions,
  GetListPayment,
} from "../../API/AdminAPI/GET.tsx";
import moment from "moment";

const createTable = (data: any[], headers: string[], dataKeys: string[]) => {
  return `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
      <thead>
        <tr style="background-color: #0b81ff;">
          ${headers
            .map(
              (header) => `
            <th style="padding: 8px; border: 1px solid #ddd; color: white; font-weight: bold;">
              ${header}
            </th>
          `
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (row) => `
          <tr>
            ${dataKeys
              .map(
                (key) => `
              <td style="padding: 8px; border: 1px solid #ddd;">
                ${
                  key.includes("Date") || key.includes("CreatedAt")
                    ? moment(row[key]).format("YYYY-MM-DD HH:mm:ss")
                    : key === "price" || key === "Amount"
                    ? `$${row[key]}`
                    : key === "status" && typeof row[key] === "number"
                    ? row[key] === 1
                      ? "Processed"
                      : "Pending"
                    : row[key]?.toString() || ""
                }
              </td>
            `
              )
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

export const generateAdminReport = async () => {
  try {
    // Fetch all data
    const [users, reports, activities, forms, transactions, payments] = await Promise.all([
      GetListUser(),
      GetListReportsFinished(),
      GetListActivity(),
      GetListArtistForm(),
      GetListAllTransactions(),
      GetListPayment(),
    ]);

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ArtHub Administration Report</title>
          <style>
            @media print {
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                font-size: 11px;
              }
              h1 {
                color: #333;
                text-align: center;
                font-size: 24px;
                margin-bottom: 10px;
              }
              h2 {
                color: #0b81ff;
                font-size: 18px;
                margin-top: 30px;
                page-break-before: always;
              }
              .section:first-of-type h2 {
                page-break-before: avoid;
              }
              table {
                page-break-inside: avoid;
              }
              @page {
                margin: 1.5cm;
                size: A4;
              }
              .no-print {
                display: none;
              }
            }
            
            /* Screen styles */
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 210mm;
              margin: 0 auto;
              background: #f5f5f5;
            }
            .content {
              background: white;
              padding: 30px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="content">
            <h1>ArtHub Administration Report</h1>
            <p style="text-align: center; color: #666;">
              Generated on: ${moment().format("YYYY-MM-DD HH:mm:ss")}
            </p>

            <div class="section">
              <h2>User List</h2>
              ${createTable(
                users,
                ["ID", "Username", "Email", "Rank"],
                ["accountID", "userName", "email", "nameOfRank"]
              )}
            </div>

            <div class="section">
              <h2>Reports</h2>
              ${createTable(
                reports,
                ["ID", "Description", "Date", "Status"],
                ["reportId", "description", "createdDate", "status"]
              )}
            </div>

            <div class="section">
              <h2>Activities</h2>
              ${createTable(
                activities,
                ["Owner", "Activity", "User Interact", "Date"],
                ["ownerName", "activityName", "userInteract", "activityDate"]
              )}
            </div>

            <div class="section">
              <h2>Artist Upgrade Requests</h2>
              ${createTable(
                forms,
                ["Form ID", "User ID", "Description", "Date"],
                ["formId", "userId", "descriptions", "dateCreation"]
              )}
            </div>

            <div class="section">
              <h2>Transactions</h2>
              ${createTable(
                transactions,
                ["Transaction ID", "Seller ID", "Buyer ID", "Artwork ID", "Price", "Date"],
                ["transactionID", "sellerID", "buyerID", "artworkID", "price", "buyDate"]
              )}
            </div>

            <div class="section">
              <h2>Payments</h2>
              ${createTable(
                payments,
                ["Payment ID", "User ID", "Amount", "Status", "Transaction Code", "Created At"],
                ["paymentId", "userId", "amount", "status", "transCode", "createdAt"]
              )}
            </div>
          </div>

          <div class="no-print" style="position: fixed; bottom: 20px; right: 20px;">
            <button onclick="window.print()" style="
              padding: 12px 24px;
              background-color: #0b81ff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">
              Save as PDF
            </button>
          </div>
        </body>
      </html>
    `;

    // Create and open print window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();

      // Wait for content to load
      printWindow.onload = () => {
        // Automatically open print dialog
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    } else {
      throw new Error("Unable to open print window. Please allow popups.");
    }
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};
