package command

import (
	"fmt"
	"strconv"

	"github.com/hink/go-blink1"
	"github.com/codegangsta/cli"
)

func CmdFade(c *cli.Context) error {
	var args [3]uint8
	for index, _ := range args  {
		args[index] = parseUint(c.Args().Get(index))
	}

	device, err := blink1.OpenNextDevice()
	if err != nil {
		return err
	} 
	state := blink1.State{args[0], args[1], args[2], 0, 10000, 10000}
	device.SetState(state)
	device.Close()
	return nil
}

func parseUint(arg string) (uint8) {
	ans, err := strconv.ParseUint(arg, 10, 8)
	if err != nil {
		fmt.Printf("Not valid numbers")
	}
	return uint8(ans)
}