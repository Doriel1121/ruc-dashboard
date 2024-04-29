export default function DownloadFile(fileUrl, fileName) {
  // Create a temporary anchor element
  const downloadLink = document.createElement("a");
  downloadLink.href = fileUrl;
  downloadLink.setAttribute("download", fileName); // Set desired file name
  document.body.appendChild(downloadLink);

  // Trigger the click event to initiate download
  downloadLink.click();

  // Clean up
  document.body.removeChild(downloadLink);
}
