export async function generateSamples(id) {
  const response = await fetch("http://localhost:5000/generate");
  console.log("Generating samples...");
  const responseJson = await response.json();
  return responseJson["processed_files"];
}
