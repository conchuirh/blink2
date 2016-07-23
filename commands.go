package main

import (
	"fmt"
	"os"

	"github.com/codegangsta/cli"
	"github.com/conchuirh/blink2/command"
)

var GlobalFlags = []cli.Flag{}

var Commands = []cli.Command{
	{
		Name:   "devices",
		Usage:  "List serial #'s of connected blink(1) devices",
		Action: command.CmdDevices,
		Flags:  []cli.Flag{},
	},
	{
		Name:   "fade",
		Usage:  "Fade led from current color to new color given over given time",
		Action: command.CmdFade,
		Flags:  []cli.Flag{},
	},
	{
		Name:   "set",
		Usage:  "Change color to given color",
		Action: command.CmdSet,
		Flags:  []cli.Flag{},
	},
	{
		Name:   "play",
		Usage:  "Play the current loaded pattern",
		Action: command.CmdPlay,
		Flags:  []cli.Flag{},
	},
	{
		Name:   "writePatternLine",
		Usage:  "Write pattern given amount of time to hold given color at given postion in the pattern",
		Action: command.CmdWritePatternLine,
		Flags:  []cli.Flag{},
	},
	{
		Name:   "readPatternLine",
		Usage:  "Get the current pattern at given postion",
		Action: command.CmdReadPatternLine,
		Flags:  []cli.Flag{},
	},
	{
		Name:   "off",
		Usage:  "Turn off blink(1) device",
		Action: command.CmdOff,
		Flags:  []cli.Flag{},
	},
}

func CommandNotFound(c *cli.Context, command string) {
	fmt.Fprintf(os.Stderr, "%s: '%s' is not a %s command. See '%s --help'.", c.App.Name, command, c.App.Name, c.App.Name)
	os.Exit(2)
}
