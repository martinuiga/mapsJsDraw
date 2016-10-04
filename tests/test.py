import os
from selenium import webdriver

driver = webdriver.Firefox()
driver.get("file://index.html");

# Create a screenshots directory if not present
# NOTE 2: We are taking screenshots to show CircleCI artifacts
driver.get_screenshot_as_file('screenshots/test.png')

# Assert the Page Title
map = driver.title('Shapefile GMaps')
assert "Shapefile GMaps" in driver.title
# Close the browser window
driver.close()