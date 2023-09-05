from pdfminer.high_level import extract_text, extract_pages
import fitz
import PIL.Image
import io
import tabula
import pandas as pd

result = {}
fileName = "test.pdf"

# extract text from pdf
text = extract_text(fileName)
result[fileName] = text
print(f"Extracted text from {fileName}", end="\n\n")

# extract images from pdf
pdf = fitz.open(fileName)
counter = 0
for i in range(len(pdf)):
  page = pdf[i]
  images = page.get_images()
  for image in images:
    base_img = pdf.extract_image(image[0])
    image_data = base_img["image"]
    img = PIL.Image.open(io.BytesIO(image_data))
    extension = base_img["ext"]
    # img.save(open(f"{fileName}.image{counter}.{extension}", "wb"))
    counter += 1
print(f"Extracted {counter} images from {fileName}", end="\n\n")

# extract tables from pdf
count = 0
tables = tabula.read_pdf(fileName, pages="all")
if tables:
  for idx, df in enumerate(tables):
    print("table number: " + str(idx))
    print(df, end="\n\n")
    count += 1
print(f"Extracted {count} tables from {fileName}", end="\n\n")