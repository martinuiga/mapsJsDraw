import os
from selenium import webdriver

driver = webdriver.Firefox()
driver.Navigate().GoToRelativePath("/index.html");

# Create a screenshots directory if not present
# NOTE 2: We are taking screenshots to show CircleCI artifacts
driver.get_screenshot_as_file('screenshots/test.png')

# Assert the Page Title
driver.find_element_by_id('map')

# Close the browser window
driver.close()