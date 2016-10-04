import os
from selenium import webdriver

driver = webdriver.Firefox()
driver.get("index.html")

# Create a screenshots directory if not present
# NOTE 2: We are taking screenshots to show CircleCI artifacts
if not (os.path.exists('./tests/screenshots')):
    os.makedirs('./tests/screenshots')
# Save screenshot in the created directory
driver.save_screenshot('./tests/screenshots/test.png')

# Assert the Page Title
driver.find_element_by_id('map')

# Close the browser window
driver.close()