import React from 'react';
import './NewEvent.css';
import { Input, Dialog, Button, Text, Switch, Select, createListCollection, Separator,
         Textarea } from "@chakra-ui/react"


const NewEvent = () => {

  return (
    <div>
        <Dialog.Root>
            <Dialog.Trigger>
                <Button variant="subtle" size="sm">
                    New Event
                </Button>
            </ Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.CloseTrigger />
                    <Dialog.Header>
                        <Dialog.Title width="100%">
                            <div className="new-event-header">
                                new event
                            </div>
                        </ Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body> 
                        <Input placeholder="Title" variant="flushed" size="lg" />
                        <Input placeholder="Location" variant="flushed" />
                        <div className='timeBox'>
                            <div className='innerTimeBox1'>
                                <Text fontWeight="bold" textStyle="sm">All-day</Text>
                                <Switch.Root>
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                </Switch.Root>
                            </div>
                            <div className='innerTimeBox1'>
                                <Input placeholder="Date" variant="flushed" size="xs" mr="220px"/>
                                <Input placeholder="Start (time)" variant="flushed" size="xs" />
                            </div>
                            <div className='innerTimeBox1'>
                                <Input placeholder="Date" variant="flushed" size="xs" mr="220px"/>
                                <Input placeholder="End (time)" variant="flushed" size="xs" />
                            </div>
                            <div className='innerTimeBox2' >
                                <Text fontWeight="bold" textStyle="sm">Repeat</Text>
                                <Select.Root collection={repeatOptions} size="xs" width="100px" variant="subtle">
                                    <Select.HiddenSelect />
                                    <Select.Label />
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Never" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                            <Select.ClearTrigger />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Select.Positioner>
                                            <Select.Content>
                                                {repeatOptions.items.map((repeatOption) => (
                                                    <Select.Item item={repeatOption} key={repeatOption.value}>
                                                        {repeatOption.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                    </Select.Positioner>
                                </Select.Root>
                            </div>
                        </div>
                        <Separator marginTop="6px"/>
                        <div className='calendarBox'>
                            <Text fontWeight="bold" mr="200px" textStyle="sm">Calendar</Text>   
                            <Select.Root collection={calendarOptions} size="xs" width="100px" variant="subtle">
                                    <Select.HiddenSelect />
                                    <Select.Label />
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Events" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                            <Select.ClearTrigger />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Select.Positioner>
                                            <Select.Content>
                                                {calendarOptions.items.map((calendarOption) => (
                                                    <Select.Item item={calendarOption} key={calendarOption.value}>
                                                        {calendarOption.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                    </Select.Positioner>
                                </Select.Root>      
                        </div>
                        <Separator marginTop="10px"/>
                        <Textarea placeholder="Notes" height="200px" />
                        <div className="actionButtons">
                            <Button variant="outline">Save</Button>
                            <Button variant="outline" style={{ marginLeft: "8px" }}>Cancel</Button>
                        </div>
                    </ Dialog.Body>
                    <Dialog.Footer />
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    </div>
    
    
  );
};

const repeatOptions = createListCollection({
    items: [
        { label: "Never", value: "never" },
        { label: "Daily", value: "daily"},
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly"},
        { label: "Custom...", value: "custom"},
    ],
})

const calendarOptions = createListCollection({
    items: [
        { label: "Events", value: "events" },
        { label: "Bible Studies", value: "bibleStudies" },
    ],
})

export default NewEvent;